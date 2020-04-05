import react from 'react'
import axios from 'axios'
import { AsyncPage } from './AsyncPage.js'
import { FourOhFour } from './FourOhFour.js'
import { Header } from '../Header.js'

const h = react.createElement

class AuthorNotFoundAuthor extends Error {}

export class Author extends AsyncPage {
  static async preloadAsyncData (props) {
    try {
      const { data } = await axios.get(`http://localhost:3001/api/author/${props.match.params.authorId}`)
      return { author: data }
    } catch (err) {
      if (err.response.status === 404) {
        throw new AuthorNotFoundAuthor()
      }
      throw err
    }
  }

  render () {
    if (this.state.loading) {
      return h('div', null,
        h(Header),
        h('div', null, 'Loading ...')
      )
    }

    if (!this.state.author) {
      return h(FourOhFour, {
        staticContext: this.props.staticContext,
        error: 'Author not found'
      })
    }

    return h('div', null,
      h(Header),
      h('div', null,
        h('h2', null, this.state.author.name),
        h('div', null,
          h('p', null,
            this.state.author.bio
          )
        ),
        h('h3', null, 'Books'),
        h('ul', null,
          this.state.author.books.map((book) =>
            h('li', { key: book.id }, `${book.title} (${book.year})`)
          )
        )
      )
    )
  }
}
