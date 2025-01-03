const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <h4>total of {sum} exercises</h4>

const Part = ({ name, exercises }) =>
    <p>
      {name} {exercises}
    </p>


const Content = ({ parts }) => 
  parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)

const Course = ({ course }) => {
  return (
    <>
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
      </div>
    </>
  )
}

export default Course