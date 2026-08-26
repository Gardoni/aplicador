// word-converter.js - Lê imagens do Word como base64
export let questoesDoWord = [];

export async function importarWordComImagem(input){
  let file = input.files[0];
  let arrayBuffer = await file.arrayBuffer();
  let result = await mammoth.convertToHtml({arrayBuffer}, {
    convertImage: mammoth.images.imgElement(img => {
      return img.read("base64").then(buffer => {
        return { src: "data:" + img.contentType + ";base64," + buffer };
      });
    })
  });
  // parseia questões mantendo <img>...
}