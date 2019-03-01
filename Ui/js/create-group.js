let addMemberBtn = document.querySelector(".add-member");
let listMember = document.querySelector(".list-members");
let inputedMember = document.getElementById("member-input");



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
    paragraph.appendChild(NewMember);
    allMembers.appendChild(span);
    inputedMember.value = "";
  };
  
  addMemberBtn.addEventListener("click", addMember);