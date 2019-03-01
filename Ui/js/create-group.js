const addMemberBtn = document.querySelector('.add-member');
const listMember = document.querySelector('.list-members');
const inputedMember = document.getElementById('member-input');

const addMember = (e) => {
  e.preventDefault();
  if (inputedMember.value === '') {
    return;
  }
  if (!inputedMember.value.includes('@')) {
    return;
  }
  const allMembers = listMember;
  const NewMember = document.createTextNode(inputedMember.value);
  const paragraph = document.createElement('p');

  // create a span element
  const span = document.createElement('span');
  // create the text that will be in the span
  const createdSpan = document.createTextNode('x');
  // append created x to span tag
  span.appendChild(createdSpan);
  // append span to p tag
  paragraph.appendChild(span);

  paragraph.appendChild(NewMember);

  allMembers.appendChild(paragraph);
  inputedMember.value = '';
};

addMemberBtn.addEventListener('click', addMember);
