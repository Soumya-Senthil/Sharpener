var Form = document.querySelector('form');
var NameInput = Form.querySelector('#name').nextElementSibling;
var EmailInput = Form.querySelector('#email').nextElementSibling;
var PhoneInput = Form.querySelector('#phone').nextElementSibling;
var DateInput = Form.querySelector('[type="date"]');
var TimeInput = Form.querySelector('[type="time"]');
var apiEndPoint =  'https://crudcrud.com/api/376bd00ba6ed43cf844e6c57aa4aaabd';
var post_json = {}
var isEditing = false;
var editId = '';
var gotDetails = {};

Form.addEventListener('submit',(e)=>{
    e.preventDefault();
    post_json.name = NameInput.value;
    post_json.email = EmailInput.value;
    post_json.phone = PhoneInput.value;
    post_json.date = DateInput.value;
    post_json.time = TimeInput.value;
    NameInput.value ="";
    EmailInput.value="";
    PhoneInput.value="";
    DateInput.value="";
    TimeInput.value="";
    if (isEditing){
        isEditing=false;
        update()
    }
    else{
        post()
    }
})
async function update(){
    await axios.put(`${apiEndPoint}/registeruser/${editId}`,post_json);
    getData();
}
async function post(){
    await axios.post(`${apiEndPoint}/registeruser`,post_json);
    getData();
}
async function getData(){
    var data_1 = await axios.get(`${apiEndPoint}/registeruser`);
    var userDetails = document.getElementById('Users');
    userDetails.innerHTML='';
    var ul = document.createElement('ul');
    ul.style = "list-style-type:none"
    ul.setAttribute('id','userdetails-ul');
    userDetails.appendChild(ul)
    if (data_1.data.length === 0){
        ul.innerHTML =" No registered users"
        return
    }
    var text = document.createTextNode("User Details");
    ul.appendChild(text);
    data_1.data.forEach(user => {
        // console.log(user._id);
        var li = document.createElement('li');
        var delBtn = document.createElement('button');
        var editBtn = document.createElement('button');
        delBtn.innerText='delete';
        editBtn.innerText ='edit';
        li.setAttribute('id',`${user._id}`);
        delBtn.style = 'color:white;background-color:red;margin-left:10px;'
        editBtn.style = 'color:white;background-color:yellow;margin-left:10px;'
        li.innerHTML = `Name : ${user.name} , Email : ${user.email} , Phone : ${user.phone} , Date : ${user.date} , Time : ${user.time}`
        li.appendChild(delBtn)
        li.appendChild(editBtn)
        ul.append(li)
    })
}
getData();

async function updateDetails(isEdit){
    var data = await axios.get(`${apiEndPoint}/registeruser/${isEdit}`);
    var element = document.getElementById(`${isEdit}`);
    element.parentNode.removeChild(element);
    NameInput.value = data.data.name;
    EmailInput.value = data.data.email;
    PhoneInput.value = data.data.phone;
    DateInput.value = data.data.date;
    TimeInput.value = data.data.time;
}

document.addEventListener('click',(e)=>{
    if (e.target.innerText == 'delete'){
            axios.delete(`${apiEndPoint}/registeruser/${e.target.parentNode.id}`);
    
    var element = document.getElementById(`${e.target.parentNode.id}`);
    element.parentNode.removeChild(element);
    }

    if (e.target.innerText == 'edit'){
        var isEdit = `${e.target.parentNode.id}`
        isEditing = true;
        editId = `${e.target.parentNode.id}`
        updateDetails(isEdit);
    }
});