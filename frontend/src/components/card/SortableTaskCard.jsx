import React from 'react'
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import TaskCard from './TaskCard'

function SortableTaskCard(props) {
    const {attributes,listeners,setNodeRef,transform,transition} = useSortable({id:props.task.id})

    const style = {
        transform:CSS.Transform.toString(transform),
        transition
    }

  return (
    <div 
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
    >
        <TaskCard {...props}/>
    </div>
  )
}

export default SortableTaskCard