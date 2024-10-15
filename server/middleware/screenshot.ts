// Because this image is both used in the Github readme and the website
export default defineEventHandler(async (event) => {
  if (event.path === '/public/images/screenshot.png') {
    const protocol = getRequestProtocol(event)
    const host = getRequestHost(event)
    return sendProxy(event, `${protocol}://${host}/images/screenshot.png`)
  }
})
