const apiRequest = async (url = "", optionObj = null, errMsg = null) => {
    try {
        const resp = await fetch(url, optionObj)
        if (!resp.ok) throw new Error('Please reload the app.')
    } catch (err) {
        errMsg = err.message
    } finally {
        return errMsg
    }
}

export default apiRequest;