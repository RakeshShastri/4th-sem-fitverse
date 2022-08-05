fetch('http://localhost:8080/getWorkoutData?type=HIIT')
.then((response) => response.json())
.then((data) => createCards(data));

createCards = (data) => {
data.forEach(data => {
  mountCard(data);
});
}
mountCard = (data) => {
let container = document.getElementById('mainContainer');
let rowOuter = document.createElement('div');
rowOuter.className = "row mt-3";
let col_1 =  document.createElement('div');
col_1.className = "col-12";
let card =  document.createElement('div');
card.className = "card shadow mg-b-20 mg-lg-b-25";
let cardHeader =  document.createElement('div');
cardHeader.className = "card-header";
cardHeader.style.backgroundColor = "#FF4433";
let rowInner_1 = document.createElement('div');
rowInner_1.className = "row";
let col_2 =  document.createElement('div');
col_2.className = "col-6";
let h =  document.createElement('h6');
h.className = "m-0 font-weight-bold text-white";
h.innerText = data.name;
let cardBody =  document.createElement('div');
cardBody.className = "card-body pd-20 pd-lg-25";
let rowInner_2 = document.createElement('div');
rowInner_2.className = "row g-0";
let col_3 =  document.createElement('div');
col_3.className = "col md-4";
let gif =  document.createElement('img');
gif.src = data.gifpath;
gif.style = "width: auto; height: 200px; margin: 28px;";
let col_4 =  document.createElement('div');
col_4.className = "col md-8";
let sr = document.createElement('p');
sr.innerHTML = `Sets: ${data.sets} <br><br> Reps: ${data.reps}`;

col_2.appendChild(h);
rowInner_1.appendChild(col_2);
cardHeader.appendChild(rowInner_1);

col_3.appendChild(gif);
col_4.appendChild(sr);
rowInner_2.appendChild(col_3);
rowInner_2.appendChild(col_4);
cardBody.appendChild(rowInner_2);

card.appendChild(cardHeader);
card.appendChild(cardBody);

col_1.appendChild(card);
rowOuter.appendChild(col_1);

container.appendChild(rowOuter);
};

