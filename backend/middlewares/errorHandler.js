exports.notFound = (req, res, next)=>{
    const error = new Error(`Not Found`)
    res.status(404)
    next(error)
}

exports.errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode === 200? 500: res.statusCode
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
        success: false,
        message
    })
}