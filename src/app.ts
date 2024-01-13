import express, { Router, Request, Response } from 'express';
import LeagueService from './index';
import cors from 'cors';

const app = express();
const routes = Router();

app.use(express.json());
app.use(cors());

routes.get('/', () => console.log('Server is Up'));
routes.post('/user', async (req: Request, res: Response) => {
  try {
    const { login, tag } = req.body;
    const user = await LeagueService.findUser(login, tag);
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(400).send('Usuario não encontrado');
  }
}) // find user.

routes.get('/return', (req: Request, res: Response) => {

}) // voltar para a tela inicial.
routes.get('/match/init', async (req: Request, res: Response) => {
  try {
    const initMatch = await LeagueService.initGame();
    return res.status(200).send(initMatch);
  } catch (error) {
    console.error(error);
    return res.status(400).send('Usuario não encontrado');
  }
}); // inicia partida.
routes.get('/match/finish', (req: Request, res: Response) => {

}) // finaliza partida..

app.use(routes);

export { app };
