import client from './client.js'
import API_ENDPOINTS from './endpoints.js'

export const getHomeData = async () => {
  try {
    const response = await client.get(API_ENDPOINTS.HOME.GET)
    return response.data
  } catch (error) {
    console.error('Error fetching home data:', error)
    throw error
  }
}