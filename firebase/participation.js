import { db } from './admin';

export default class Participation {
  constructor(uid) {
    this.dbRef = db.collection('participation').doc(uid);

    this.giveaways = {};
  }

  async save() {
    await this.dbRef.set({
      giveaways: this.giveaways
    }).catch(Error);
    return this;
  }

  async fetch() {
    const data = (await this.dbRef.get().catch(Error)).data();
    this.giveaways = data ? data.giveaways : {};
    return this;
  }

  async delete() {
    await this.dbRef.delete().catch(Error);
    delete this;
  }
}