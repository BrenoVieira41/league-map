import player from 'play-sound';

interface User {
  id?: string;
  accountId?: string;
  puuid?: string;
  name?: string;
  profileIconId?: number;
  revisionDate?: number;
  summonerLevel?: number;
}

class LeagueService {
  private user: User;
  private puuid: string;
  private count: number;
  private map: number;
  private tab: number;

  constructor() {
    this.user = {};
    this.puuid = '';
    this.count = 0;
    this.map = 0;
    this.tab = 0;
  }

  public async findUser(login: string, tag: string): Promise<any> {
    const newLogin = encodeURIComponent(login);
    const findUser = await fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${newLogin}/${tag}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://developer.riotgames.com',
        'X-Riot-Token': process.env.API
      }
    }
    ).then(response => response.json());

    this.puuid = findUser.puuid;

    const completUser = await fetch(
      `https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${this.puuid}`, {
      headers: {
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://developer.riotgames.com',
        'X-Riot-Token': process.env.API
      }
    }
    ).then(response => response.json());
    this.user = completUser;
    return completUser;
  }

  public async initGame(): Promise<any> {
    let count = 0;

    let interval = setInterval(async () => {
      count += 5;

      if (count % 20 === 0) {
        const validate = await this.validateGame();
        if (validate) clearInterval(interval);
      }

      if (count % 15 === 0) {
        player().play(__dirname + '/audios/ping_missing.mp3');
        this.map = this.tab + 1;
        return;
      }

      if (count % 5 === 0) {
        player().play(__dirname + '/audios/5sec.ogg');
        this.map = this.map + 1;
        return;
      }
    }, 5000);
  }

  private async validateGame(): Promise<any> {
    const response = await fetch(
      `https://br1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${this.user.id}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://developer.riotgames.com',
        'X-Riot-Token': process.env.API
      }
    }
    ).then(response => response.json());
    if (response.status) return true;
    return false;
  }

}

export default new LeagueService();
