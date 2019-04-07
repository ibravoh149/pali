import bodyParser from 'body-parser'; 
import morgan from 'morgan';
import { Server } from '@overnightjs/core';
import { controllers } from "./controllers";

class App extends Server{


  constructor() {
    super()
    this.config();
  }

  private config(): void {

    this.app.use(morgan('dev'));
    this.app.use(bodyParser.json()); 
    this.app.use(bodyParser.urlencoded({
      extended: false,
    }));

    
    super.addControllers(controllers);

    
  }

  public start(port: number): void {
        
    this.app.listen(port, () => {
        console.log('Server listening on port:' + port);
    })
}
  

}

export default new App().start(3000);
