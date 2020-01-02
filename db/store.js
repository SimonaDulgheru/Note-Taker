const util = require(`util`);
const fs = require(`fs`);
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

class Store {
    constructor (){
        this.lastId = 0;
}
    readFile() {
        return readFileAsync("db/db.json", "utf8")
    }
    writeFile(note) {
        return writeFileAsync("db/db.json", JSON.stringify(note))
    }

    getNotes(){
        return this.readFile()
            .then(notes => {
                let parseNotes; 
            try{
                parseNotes = [].concat(JSON.parse(notes))
            }
            catch (err) {
                parseNotes = [];
            }
            return parseNotes;
            }) 

    }
    addNotes(note) {
        const { title, text } = note;
        if(!title || !text){
            throw new Error("Error")
        }
        const newNote = {title, text, id:++this.lastId }
        return this.getNotes()
            .then(notes => 
                [...notes, newNote]
            )
            .then(updatedNotes => this.writeFile(updatedNotes))
            .then(()=> newNote)
    }
    removeNotes(id) {
        return this.getNotes()
            .then(notes => notes.filter(note => note.id !== parseInt(id)))
            .then(filterNotes => this.writeFile(filterNotes))
    }
};

module.exports = new Store();