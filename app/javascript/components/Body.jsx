import React from "react"
import PropTypes from "prop-types"
import AllNotes from './AllNotes.jsx'
import NewNote from './NewNote.jsx'

class Body extends React.Component {

  constructor(props) {
    super(props);
    this.reloadNotes = this.reloadNotes.bind(this);
    this.showError = this.showError.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);

    this.state = {
      notes: [],
      error: "",
    };
  }

	componentDidMount(){
		fetch("/api/v1/notes.json", {
			method: "GET"
		})
		.then(response => response.json())
		.then( (response) => {
			this.setState({ notes: response });
		});
	}

	reloadNotes(note){
		let notes = this.state.notes.concat(note)
  	this.setState({
  	  notes: notes,
  	});
	}

	showError(error){
  	this.setState({
  	  error: error
  	});
	}

	handleEdit(id, note){
		fetch('/api/v1/notes/' + id, {
		  method: 'PATCH',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
		  	note: note
		  })
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(!("errors" in responseJson)){
    		let notes = this.state.notes.filter((note) => { return note.id != id });
    		notes.push({id: id, name: note.name, description: note.description});
    		this.setState({notes: notes });
				this.state.error = ""
				this.showError("")

				console.log("True")
			}else{
				this.showError("Error has occured")

				console.log("False")
			}
		})
		.catch((error) => {
  		console.error(error);
  	})
  }

	handleDelete(id){
		fetch('/api/v1/notes/' + id, {
		  method: 'DELETE',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		  }
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(!("errors" in responseJson)){
    		let notes = this.state.notes.filter((note) => { return note.id != id });
    		this.setState({notes: notes });
				this.state.error = ""
			}else{
				this.state.error = "Error has occured"
			}
		})
		.catch((error) => {
  		console.error(error);
  	})
  }

	render(){
		return(
			<div>
				<div id="note-error"> {this.state.error}</div>
				<NewNote reloadNotes={this.reloadNotes} showError={this.showError} />
				<AllNotes notes={this.state.notes} handleDelete={this.handleDelete} handleEdit={this.handleEdit} />
			</div>
		);
	}
}

export default Body
