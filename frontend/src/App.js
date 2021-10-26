import React from 'react';
import './App.css';
import { IoMdDoneAll } from 'react-icons/io'

class App extends React.Component { 
  constructor(props){
    super(props);
    this.state = {
      todoList:[],
      activeItem:{
        id:null, 
        title:'',
        completed:false,
      },
      editing:false, 
    }
    this.fetchTasks = this.fetchTasks.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)
    this.updateItem = this.updateItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.completeTask = this.completeTask.bind(this)


  };
  getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue; 
  }

  componentWillMount(){
    this.fetchTasks();
  }


  fetchTasks(){
    fetch('http://127.0.0.1:8000/api/task/')
    .then((response) => {
      return response.json()
    })
    .then((data) => { 
      return this.setState({todoList:data.tasks})
    })
    .catch(function(error){
      console.log('ERROR:', error)
    }) 
  }

  handleChange(e){
    let name = e.target.name
    let value = e.target.value
    this.setState({activeItem:{...this.state.activeItem,[name]:value}})
  }

  handleSubmit(e){  
    e.preventDefault();
    var csrftoken = this.getCookie('csrftoken');
    var url = 'http://127.0.0.1:8000/api/task/'
    var method = "POST"
    if (this.state.editing){

      url = `http://127.0.0.1:8000/api/task/${ this.state.activeItem.id }/` 
      method = "PUT"
    }
    
    fetch(url,{
        method:method,
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken
        },
        body:JSON.stringify({task:this.state.activeItem})
    })
    .then((response) => {
        this.fetchTasks()
        this.setState({ activeItem:{id:null, title:'',completed:false,},editing:false})
    })
    .catch((error) => console.log(error))
    
  }

  deleteItem(task){
    var url = `http://127.0.0.1:8000/api/task/${ task.id }/` 
    var csrftoken = this.getCookie('csrftoken');
    fetch(url,{
        method:'DELETE',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken':csrftoken
        },
    })
    .then((response) => {
        this.fetchTasks()

    }).catch((error) => console.log(error))

  }

  updateItem(task){
    this.setState({activeItem:task,
      editing:true
    })
    //i am not able to see updated value here
    // console.log(this.state.activeItem)
  }

  completeTask(task){

    var url = `http://127.0.0.1:8000/api/task/${ task.id }/` 
    task.completed = ! task.completed
    var csrftoken = this.getCookie('csrftoken');
    console.log('csrftoken',csrftoken)
     fetch(url,{
        method:'PUT',
        headers:{
          'Content-type':'application/json',
          'X-CSRFToken': csrftoken,
        },
        body:JSON.stringify({"task":task})
    })
    .then((response) => {
        this.fetchTasks()
    })
    .catch((error) => console.log(error))
    console.log(task)
  }

  render(){  
    return (
      <div className="">
        <div id ="task-container">
          <div id="form-wrapper">
            <form action="" id="form" onSubmit={this.handleSubmit}>
              <div className="flex-wrapper">
                <div  style={{flex: 6}} >
                  <input  
                  className="form-control"  
                  onChange={this.handleChange} 
                  id="title"  
                  type="text" 
                  name="title" 
                  placeholder="Add task.." 
                  value={this.state.activeItem.title}/>
                </div>
                <div  style={{flex: 1}}>
                  <input 
                  id="submit"   
                  className="btn btn-warning" 
                  type='submit'
                  name="Add" />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {this.state.todoList.map((todo)=>{
              const { id,title,completed } = todo ;
              return( 
                <div key={id} className="task-wrapper flex-wrapper">
                  <div style={{flex:.5}}>
                    <IoMdDoneAll style={{color:`${completed ? '#2E8B57' : '#686868'}`}} onClick={() => this.completeTask(todo)} />
                  </div>
                  <div style={{flex:6.5}}>
                    { completed ? (
                      <strike>{title}</strike>
                    ) : (
                      <span>{title}</span>
                    )  }
                  </div>
                  <div style={{flex:1}}>
                    <button 
                    className="btn btn-sm btn-outline-info"
                    onClick={()=>this.updateItem(todo)}>edit</button>
                  </div>
                  <div style={{flex:1}} >
                    <button  
                    className="btn btn-sm btn-outline-dark delete"
                    onClick={()=>this.deleteItem(todo)}>-</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;



