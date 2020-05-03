// import './css/style.css';

// import './js/app';


const formData = new FormData();

formData.append('name', 'Condrat');
formData.append('password', '1234567');

// const response = await fetch('http://localhost:7070', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'form/multipart'
//     },
//     body: formData
// });

const xhr = new XMLHttpRequest();
xhr.open('POST', 'http://localhost:7070');
xhr.send(formData);

const text = await response.text();
console.log(xhr);
