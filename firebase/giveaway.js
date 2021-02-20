import { db } from './admin';

export default class Giveaway {
  constructor(id, data) {
    this.dbRef = db.collection('giveaways').doc(id);

    this.id = id;
    this.participants = [];
    this.winner = null;
    if (data) {
      this.title = data.title;
      this.host = data.host;
      this.hostChannel = data.hostChannel;
      this.timeBegins = data.timeCreated || Date.now();
      this.timeEnds = data.timeEnds;
    } else {
      this.title = null;
      this.host = null;
      this.timeBegins = null;
      this.timeEnds = null;
    }
  }

  async save() {
    await this.dbRef.set({
      id: this.id,
      title: this.title,
      host: this.host,
      hostChannel: this.hostChannel,
      timeBegins: this.timeBegins,
      timeEnds: this.timeEnds,
      winner: this.winner,
      participants: this.participants
    }).catch(Error);
    return this;
  }

  async fetch() {
    const data = (await this.dbRef.get().catch(Error)).data();
    if (data) {
      this.title = data.title;
      this.host = data.host;
      this.hostChannel = data.hostChannel;
      this.timeBegins = data.timeCreated || Date.now();
      this.timeEnds = data.timeEnds;
      this.participants = data.participants;
      this.winner = data.winner;
    }
    return this;
  }

  async delete() {
    await this.dbRef.delete().catch(Error);
    delete this;
  }
}