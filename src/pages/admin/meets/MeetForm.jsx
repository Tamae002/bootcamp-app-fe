import meetApi from "@/apis/meet.api";
import Throbber from "@/components/misc/Throbber";
import { ENV } from "@/constants";
import { useClass } from "@/contexts/class";
import { useTheme } from "@/contexts/theme";
import formDataToJson from "@/lib/formDataToJson";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  CreateLink,
  headingsPlugin,
  HighlightToggle,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { AxiosError } from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function MeetForm({ edit = false }) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const { id: classId, meetId } = useParams();
  const { class: class_, fetchClass } = useClass();
  const meet = useMemo(
    () => class_.pertemuan.find((meet) => meet.pertemuan_id == meetId),
    [meetId, class_],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleInput = useRef(null);
  const dateInput = useRef(null);
  const descriptionInput = useRef(null);
  const attachmentLinkInput = useRef(null);

  useEffect(() => {
    if (edit) {
      console.dir(class_);
      titleInput.current.value = meet.judul;
      dateInput.current.value = meet.tanggal.slice(0, 10);
      descriptionInput.current.setMarkdown(meet.deskripsi_tugas);
      attachmentLinkInput.current.value = meet.link_lampiran;
    }
  }, [edit, class_]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.target);
    const parsedFormData = formDataToJson(formData);

    try {
      const payload = {
        kelas_id: classId,
        judul: parsedFormData.judul,
        tanggal:
          parsedFormData.tanggal === ""
            ? null
            : new Date(parsedFormData.tanggal).toISOString(),
        deskripsi_tugas: descriptionInput.current.getMarkdown(),
        link_lampiran: parsedFormData.link_lampiran,
      };

      let newMeetId = meetId;
      if (edit) {
        await meetApi.update(meetId, payload);
      } else {
        const response = await meetApi.create(payload);
        newMeetId = response.data.pertemuan_id;
      }
      fetchClass();
      navigate(`/classes/${classId}/meet/${newMeetId}`);
    } catch (err) {
      if (ENV == "development") console.error(err);

      if (err instanceof AxiosError) {
        if (err.status) setError(err.response.data?.message);
        else setError("Terjadi kesalahan pada server. Mohon  coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-auto max-w-4xl p-8">
      <title>{`${edit ? "Edit" : "Buat"} Pertemuan | Geeksfarm`}</title>
      <header className="mb-8">
        <h1 className="h-rule text-5xl">{edit ? "Edit" : "Buat"} Pertemuan</h1>
      </header>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && <p className="text-red text-sm">{error}</p>}
        <div className="flex items-end gap-4">
          <input
            ref={titleInput}
            type="text"
            id="title"
            name="judul"
            className="input h-13"
            placeholder="Judul"
            required
          />

          <div>
            <label htmlFor="start-date">Tanggal</label>
            <input
              ref={dateInput}
              id="date"
              name="tanggal"
              type="date"
              className="input"
              required
            />
          </div>
        </div>

        <MDXEditor
          ref={descriptionInput}
          markdown=""
          placeholder="Deskripsi"
          className={theme == "dark" ? "dark dark-theme" : ""}
          contentEditableClassName="prose prose-sm dark:prose-invert max-w-full"
          plugins={[
            headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            markdownShortcutPlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
            codeMirrorPlugin({
              codeMirrorExtensions: theme == "dark" ? [oneDark] : [],
              codeBlockLanguages: {
                txt: "Plain Text",
                html: "HTML",
                css: "CSS",
                js: "JavaScript",
                tsx: "TypeScript",
              },
            }),
            toolbarPlugin({
              toolbarContents: () => (
                // <KitchenSinkToolbar />
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <HighlightToggle />
                  <ListsToggle />
                  <BlockTypeSelect />
                  <CreateLink />
                  <InsertImage />
                  <InsertTable />
                  <InsertThematicBreak />
                  <InsertCodeBlock />
                </>
              ),
            }),
          ]}
        />

        <input
          ref={attachmentLinkInput}
          type="url"
          id="attachment-link"
          name="link_lampiran"
          className="input"
          placeholder="Link Lampiran"
        />

        <button className="button button-primary">
          {loading && <Throbber />} {edit ? "Simpan" : "Buat Pertemuan"}
        </button>
      </form>
    </div>
  );
}
