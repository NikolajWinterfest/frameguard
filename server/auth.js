
import jwt from 'jsonwebtoken';

const AUTH_DATA = {
    username: "admin",
    password: "test",
    role: "admin"
}
export const checkAuth = (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
   
    if (token) {

        try {
            const decoded = jwt.verify(token, 'bigSecret');

            req.username = decoded._id;
            next();
        } catch (error) {
            return res.status(403).json({
                message: "Нет доступа"
            });
        }

    } else {
        return res.status(403).json({
            message: "Нет доступа"
        });
    }
}


export const login = async (req, res) => {

  
    try {
      let username = req.body.username;
  
        if (username !== AUTH_DATA.username && req.body.password !== AUTH_DATA.password)
      {
        console.log("Нет доступа")
        return res.status(403).json({
            message: "Нет доступа"
        });
      }       

      const token = jwt.sign({
        _id: username,
      },
        'bigSecret',
        {
          expiresIn: '30d'
        }
      );
      
  
      res.json(
        {
         username: username,
         role: AUTH_DATA.role, 
         token
        });
  
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Не удалось авторизоваться",
      });
    }
  }