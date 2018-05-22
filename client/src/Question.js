import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Message, Form, Input } from 'semantic-ui-react'

class Question extends Component {
  constructor(props) {
    super(props)
    this.state = {
      correct: false,
      wrong: false
    }

    this._getQuestion = this._getQuestion.bind(this)
    this._handleChange = this._handleChange.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount() {
    const { id } = this.props.match.params
    this._getQuestion(id)
  }

  fetch(endpoint) {
    return window.fetch(endpoint)
      .then(response => response.json())
      .catch(error => console.log(error))
  }

  _getQuestion(id) {
    this.fetch(`/api/questions/${id}`)
      .then(question => this.setState({ question }))
  }

  _handleChange(e, { name, value }) {
    this.setState({ [name]: value })
  }

  _handleSubmit(e, data) {
    const { question, answer } = this.state
    window.fetch(`/api/questions/${question.id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answer })
      })
      .then(response => response.json())
      .then(result => this.setState({ correct: result.correct, wrong: !result.correct }))
      .catch(error => console.log(error))
  }

  render() {
    let { question, correct, wrong } = this.state
    return (
      <Container text>
      {question &&
        <Form success={correct} error={wrong} onSubmit={this._handleSubmit}>
          <Form.Field>
            <div dangerouslySetInnerHTML={{ __html: question.content }} />
            <Input name='answer' onChange={this._handleChange} placeholder='Answer here' />
          </Form.Field>
          <Button type='submit'>Submit</Button>
          <Button as={Link} to='/'>Back to home</Button>

          <Message
            success
            header='Correct!'
            content='Well done, challenger!'
          />
          <Message
            error
            header='Incorrect...'
            content='Try another answer!'
          />
        </Form>
      }
      </Container>
    )
  }
}

export default Question
