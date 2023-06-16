export function errorMiddleware(err, req, res, next) {
  const { status = 500, message = 'Something broke!' } = err
  res.status(status).json({ message })
}
