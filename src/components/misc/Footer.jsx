import footerLogo from "@/assets/images/logo/Logo_Footer.png";
import Facebook from "@/assets/icons/Facebook";
import Instagram from "@/assets/icons/Instagram";
import LinkedIn from "@/assets/icons/LinkedIn";

export default function Footer() {
  return (
    <footer className="mt-16">
      <div className="bg-purple-950 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-white">
            <span className="font-semibold">Geeksfarm</span> Copyright © 2026
          </p>
        </div>
      </div>
      <div className="bg-linear-to-b from-purple-600 to-purple-800 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4">
                <img
                  src={footerLogo}
                  alt="Geeksfarm Logo"
                  className="h-16 w-auto"
                />
              </div>
              <p
                className="mb-6 max-w-md text-sm leading-relaxed
                  text-purple-100"
              >
                Accelerate your tech career with the cutting-edge curriculum of
                Geeksfarm Bootcamp! by investing in your employees through
                corporate training, you demonstrate your commitment to their
                professional.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://web.facebook.com/profile.php?id=100069442941198"
                  className="flex h-10 w-10 items-center justify-center
                    rounded-full border-2 border-white bg-transparent transition
                    hover:bg-white hover:text-purple-600"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/geeksfarm/"
                  className="flex h-10 w-10 items-center justify-center
                    rounded-full border-2 border-white bg-transparent transition
                    hover:bg-white hover:text-purple-600"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/geeksfarmbootcamp/"
                  className="flex h-10 w-10 items-center justify-center
                    rounded-full border-2 border-white bg-transparent transition
                    hover:bg-white hover:text-purple-600"
                >
                  <LinkedIn className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="mb-6 text-2xl font-bold">Kontak</h4>
              <div className="space-y-3">
                <p className="text-sm text-purple-100">
                  Jln. Soekarno Hatta No.104, Bandung, Indonesia 40222
                </p>
                <p className="text-sm text-purple-100">www.geeksfarm.com</p>
                <p className="text-sm text-purple-100">+62 8597-4029-559</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
