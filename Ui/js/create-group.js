let addMemberBtn = document.querySelector(".add-member");
let listMember = document.querySelector(".list-members");
let inputedMember = document.getElementById("member-input");
let removeMemberButton = document.querySelector('.remove-member')

const addMember = e => {
  e.preventDefault();
  if (inputedMember.value == "") {
    return;
  } else if (!inputedMember.value.includes("@")) {
    return;
  }
  let allMembers = listMember;
  let NewMember = document.createTextNode(inputedMember.value);
  let paragraph = document.createElement("p");
  
  // create a span element
  let span = document.createElement("span");
  // create the text that will be in the span
  let createdSpan = document.createTextNode("x");
  // append created x to span tag
  span.appendChild(createdSpan);
  //append span to p tag
  paragraph.appendChild(span);

  paragraph.appendChild(NewMember);

  allMembers.appendChild(paragraph);
  inputedMember.value = "";
};

addMemberBtn.addEventListener("click", addMember);
