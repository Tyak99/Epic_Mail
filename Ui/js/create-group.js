let addMemberBtn = document.querySelector(".add-member");
let listMember = document.querySelector(".list-members");
let inputedMember = document.getElementById("member-input");



const add = e => {
    e.preventDefault();
    if (inputedMember.value == "") {
      return;
    } else if (!inputedMember.value.includes("@")) {
      return;
    }
    let allMembers = listMember;
    let NewMember = document.createTextNode(inputedMember.value);
    let span = document.createElement("p");
    span.appendChild(NewMember);
    allMembers.appendChild(span);
    inputedMember.value = "";
  };
  
  addMemberBtn.addEventListener("click", add);