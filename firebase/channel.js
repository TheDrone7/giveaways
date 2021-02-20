import { db } from './admin';

export default class YouTubeChannel {
  constructor(uid, id, name, description) {
    this.dbRef = db.collection('channels').doc(uid);

    if (id) this.id = id;
    if (name) this.name = name;
    if (description) this.description = description;
  }

  async save() {
    await this.dbRef.set({
      id: this.id,
      name: this.name,
      description: this.description
    }).catch(Error);
    return this;
  }

  async fetch() {
    const data = (await this.dbRef.get().catch(Error)).data();
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    return this;
  }

  async delete() {
    await this.dbRef.delete().catch(Error);
    delete this;
  }
}