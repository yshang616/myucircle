import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        // our own auth token would be shorter than at most 500;
        const isCustomAuth = token.length < 500;

        let decodedData;
        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');

            req.userId = decodedData?.id;
        }
        else {
            decodedData = jwt.decode(token);

            req.userId = decodedData?.id;
        }
        next();
    } catch (error) {
        console.log(error)
    }
}

export default auth;