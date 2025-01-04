const Persons = ({persons, filter}) => {
  if (persons.length === 0) {
    return <div>No numbers to show</div>
  }
  else if (filter !== '') {
    return (
      <div>
        {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())).map(person => <p key={person.name}>{person.name} {person.number}</p>)}
      </div>
    )
  }
  return (
    <div>
      {persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

export default Persons