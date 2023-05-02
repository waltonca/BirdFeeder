// try to convert byte array to image
let byteArray = "89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52
00 00 00 02 00 00 00 02 08 06 00 00 00 fc 18 52
22 00 00 00 06 62 4b 47 44 00 ff 00 ff 00 ff a0
bd a7 93 00 00 00 09 70 48 59 73 00 00 0b 13 00
00 0b 13 01 00 9a 9c 18 00 00 00 07 74 49 4d 45
07 df 02 0b 0f 07 05 02 38 c2 d7 00 00 00 09 70
4c 54 45 00 00 00 00 00 00 00 03 00 00 00 00 00
00 3b";

// use blob to convert byte array to image
const blob = new Blob([byteArray], {type: 'image/jpeg'});
const urlCreator = window.URL || window.webkitURL;
const imageUrl = urlCreator.createObjectURL(blob);
console.log(imageUrl);