const AddDiv = document.querySelector("header button");
const LinkContainers = document.querySelector(".link-box");
const InputElement = document.querySelector("header input");
const copyElement = document.querySelector('.link button');
const resetButton = document.querySelector('#resetBtn');

NoLinkNoticeHide();

chrome.storage.sync.get('links', function(linkStoreObj){
    if (linkStoreObj.links === undefined){
        linkStoreObj.links = [];
    }
    if(linkStoreObj.links.length > 0){
        for(var i = linkStoreObj.links.length-1; i>=0; i--){
            console.log(linkStoreObj.links[i]);
            AddLinktoContainer(linkStoreObj.links[i]);

            const copyURLslist = [...document.querySelectorAll('.linkBtn')];
            copyURLslist.forEach(urlcopied);

            const cancellist = [...document.querySelectorAll('.cancelButton')];
            
            cancellist.forEach(cancelPropertySet);
        }
    }
    console.log(LinkContainers);
    console.log(LinkContainers.innerHTML + "::" + !LinkContainers.innerHTML);

    if(!LinkContainers.innerHTML){
        EmptyNoticeDisplay();
    }
    else{
        EmptyNoticeHide();
    }

});

/*  STRUCTURE OF A LINK ELEMENT :-
    <div class="link">
        <button type="submit" class="linkBtn">
            Copy URL
        </button>
        <a class="url" href="http://www.google.com">
            http://www.google.com
        </a>
        <a role="button" class="cancelButton">
            <i class="fas fa-window-close"></i>
        </a>    
    </div>
*/ 
AddDiv.addEventListener("click", ()=>{ 
    if(InputElement.value === ""){
        NoLinkNoticeShow();
    }
    else{
        EmptyNoticeHide(); 
        NoLinkNoticeHide();
        let input = InputElement.value;
        console.log("Input bf: "+ input);
        AddLinktoContainer(input);
        console.log("Input af: "+ input);

        chrome.storage.sync.get('links', function(linkStoreObj){
            var linklist = linkStoreObj.links;
            // appendFirst the New Link to the linklist
            console.log("Input: "+ input);
            linklist.unshift(input);
            console.log(linklist);
            chrome.storage.sync.set({'links':linklist});
        });

        const copyURLslist = [...document.querySelectorAll('.linkBtn')];
        copyURLslist.forEach(urlcopied);

        const cancellist = [...document.querySelectorAll('.cancelButton')];
        
        cancellist.forEach(cancelPropertySet);
        InputElement.value = "";

        //Notify User of the New Link Added
        var notifOptions = {
            type: 'basic',
            iconUrl: 'logo48.png',
            title : 'New Link Added on LinkStoreR!!',
            message: input
        };
        chrome.notifications.create('AddLinkNotif', notifOptions);

    }
});

resetButton.addEventListener('click', ()=>{
    LinkContainers.innerHTML = "";

    chrome.storage.sync.set({'links':[]});

    EmptyNoticeDisplay();
});

const copy = (e) => {
    console.log(e.target.getAttribute("linkStore"));
    var str = e.target.getAttribute("linkStore");
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    console.log(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const remove = (e) => {
    console.log(e.target.parentNode.parentNode);
    e.target.parentNode.parentNode.remove();

    chrome.storage.sync.get('links', function(linkStoreObj){
        var linklist = [];

        const remainingURLlist = [...document.querySelectorAll('.url')];
        remainingURLlist.forEach((item)=>{
            linklist.push(item.href);
        });

        console.log(linklist);
        chrome.storage.sync.set({'links':linklist});
    });

    if(!LinkContainers.innerHTML){
        EmptyNoticeDisplay();
    }
    else{
        EmptyNoticeHide();
    }
};

function AddLinktoContainer(inputUrl){
    const NewLinkBox = document.createElement("div");
    NewLinkBox.classList.add("link");

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("linkBtn");
    copyBtn.setAttribute('type','submit');
    copyBtn.innerHTML = 'Copy URL';
    var att = document.createAttribute("linkStore");
    att.value = inputUrl;
    copyBtn.setAttributeNode(att);

    const url = document.createElement("a");
    url.classList.add("url");
    url.href = (inputUrl === "")?"None":inputUrl;
    url.target = "_blank";
    url.innerHTML = (inputUrl === "")?"None":modified(inputUrl);

    const cancelBtn = document.createElement("a");
    cancelBtn.classList.add("cancelButton");
    cancelBtn.setAttribute('role', 'button');
    cancelBtn.innerHTML = '<i class="fas fa-window-close"></i>';

    NewLinkBox.appendChild(copyBtn);
    NewLinkBox.appendChild(url);
    NewLinkBox.appendChild(cancelBtn);
    if(LinkContainers.innerHTML === ""){
        LinkContainers.appendChild(NewLinkBox);
    }
    else{
        LinkContainers.insertBefore(NewLinkBox, LinkContainers.childNodes[0]);
    }    
};


function urlcopied(item, index){
    item.addEventListener("click",copy);
};

function cancelPropertySet(item, index){
    item.addEventListener("click",remove);
};

function EmptyNoticeHide(){
    document.querySelector('.alert-warning').style.display = "none";
};
function EmptyNoticeDisplay(){
    document.querySelector('.alert-warning').style.display = "block";
};
function NoLinkNoticeHide(){
    document.querySelector('.alert-danger').style.display = "none";
};
function NoLinkNoticeShow(){
    document.querySelector('.alert-danger').style.display = "block";
};

function modified(s){
    if(s.length>60){
        s = s.slice(0,60) + " ....";
    }
    return s;
}