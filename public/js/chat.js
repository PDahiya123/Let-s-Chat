const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput =$messageForm.querySelector('input')
const $messageFormButton =$messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//templates

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const imageTemplate = document.querySelector('#image-message-template').innerHTML


// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight > scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
   t=0
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        currentuser:username,
        
        
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    t=t+1
    if(message.username!=username)
    {document.getElementsByClassName("lal")[document.getElementsByClassName("lal").length-1].style.backgroundColor="rgb(233 32 199)"
     


    document.getElementsByClassName("message")[document.getElementsByClassName("lal").length-1].style.marginLeft="20px"
         }
         var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
       text1=message.text.replace(exp, `<a target="_blank" href='$1'>$1</a>`)

         var exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
         document.getElementsByClassName("converted_url")[document.getElementsByClassName("converted_url").length-1].innerHTML=text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
        
           

         
   
    autoscroll()


})

socket.on('sendimage',(message)=>{
  console.log(message)
  const html = Mustache.render(imageTemplate,{
    username: message.username,
    imgsrc: message.text,
    currentuser:username,
    
    
    createdAt: moment(message.createdAt).format('h:mm A')
})

$messages.insertAdjacentHTML('beforeend',html)


})

socket.on('locationMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})





document.querySelector('#message-form').addEventListener('submit', (e)=>{

    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')




    const message = e.target.elements.message.value
    socket.emit('sendMessage', message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()


        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
        
    })
})


document.querySelector('#sendimg').addEventListener('click', ()=>{

    socket.emit('sendimg', src,(error)=>{
       

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
        
    })

})


document.querySelector('#send-location').addEventListener('click', ()=>
{
     
    if(!navigator.geolocation)  {

        return alert('Geolocation is not supported by your broswer.')

    }
   
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{

        

        console.log(position)
        socket.emit('sendLocation', {
            
            latitude : position.coords.latitude,
            longitude: position.coords.longitude


        },()=>{
                 
            $sendLocationButton.removeAttribute('disabled')

            console.log("locations shared")
        })


        

        
    })
}




)
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})