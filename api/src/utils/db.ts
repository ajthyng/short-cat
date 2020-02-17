export const getMongoURI = () => {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env

  let credentials = ''
  if (DB_USER && DB_PASSWORD) {
    credentials = `${DB_USER}:${DB_PASSWORD}@`
  }

  return `mongodb://${credentials}${DB_HOST}:27017/${DB_NAME}?authSource=admin`
}
