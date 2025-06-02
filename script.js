


const tags_list = document.getElementById('tags-list')
const add_tag_button = document.getElementById('add-tag-button')




const all_tags = []
class Tag {
	constructor(tag_name='new tag', descending_tags=[], child_tags=[]) {
		this.name = tag_name
		this.descending_tags = descending_tags
		this.child_tags = child_tags
		all_tags.push(this)
	}

	remove(){
		const index = all_tags.indexOf(this)
		if (index === -1) {
			console.warn(`Cannot remove ${this.name}`)
			return
		}
		all_tags.splice(index,1)
	}
}




const winter_tag = new Tag('winter')
const clothes_tag = new Tag('clothes');
const winter_clothes_tag = new Tag('winter-clothes',[],[winter_tag, clothes_tag])
const cool_data_structure = [{tags:[winter_clothes_tag], value:'insert epic winter clothes'}]




function create_tag(name, tags=[]) {
	name = String(name)

	const root = document.createElement('div')
	root.className = 'tag'

	const tag_name = document.createElement('div')
	tag_name.className = 'tag-name'
	tag_name.textContent = name
	root.appendChild(tag_name)
	
	const tag_container = create_tag_container(tags)
	root.appendChild(tag_container)


	return root
}




function create_tag_container(tags=[]) {
	if (!Array.isArray(tags)) {
		console.log('tags',tags)
		throw new Error("tags is not array", tags);
	}
	const tag_container = document.createElement('div')
	tag_container.className = 'tag-container'
	for (const tag of tags) {
		tag_container.appendChild(tag)
	}
	return tag_container
}




function create_item_container(name, tags=[]) {
	const root = document.createElement('div')
	root.className = 'item-container'

	const item_name = document.createElement('div')
	item_name.className = 'item-name'
	item_name.textContent = name
	root.appendChild(item_name)

	const tag_container = create_tag_container(tags)
	root.appendChild(tag_container)

	return root
}




function create_selection_panel_button(get_panel_elements, text_content) {
	const root = document.createElement('button')
	root.className = 'selection-button'
	root.textContent = text_content
	root.addEventListener('click',()=>{
		const selection_panel = document.createElement('div')
		selection_panel.className = 'selection-panel'
		//Setting the panel position doesn't work, it has position absolute
		const rect = root.getBoundingClientRect()
		console.log(rect.top, rect.left)
		selection_panel.style.top = `${rect.top}px`
		selection_panel.style.left = `${rect.left}px`
		const panel_elements = typeof get_panel_elements === 'function'? get_panel_elements(): get_panel_elements
		if (!Array.isArray(panel_elements)) throw new Error("panel_elements is not an array");
		if (panel_elements.length === 0) {
			selection_panel.innerHTML += '<p>Nothing here</p>'
		}
		for (const element of panel_elements) {
			if (!(element instanceof HTMLElement)) {
				console.error(element, panel_elements)
				throw new Error("panel_elements contains non instance of HTMLElement");
			}
			selection_panel.appendChild(element)
		}
		document.body.appendChild(selection_panel)

		selection_panel.addEventListener('mouseleave',()=>{
			selection_panel.remove()
		})
	})
	return root
}




function create_editable_tag(tag_object, all_tags) {
	if (!(tag_object instanceof Tag))throw new Error("tag_object is not instance of Tag");
	if (!Array.isArray(all_tags)) throw new Error("all_tags is not an Array");
	if (all_tags.some(e=>!(e instanceof Tag))) throw new Error("all_tags contains non tags");

	const name = String(tag_object.name)

	const root = document.createElement('div')
	root.className = 'editable-tag'

	const tag_name = document.createElement('input')
	tag_name.type = 'text'
	tag_name.className = 'editable-tag-name'
	tag_name.value = name
	tag_name.addEventListener('input',()=>{
		tag_object.name = tag_name.value
		console.log(tag_object)
	})
	root.appendChild(tag_name)

	const add_child_tag_button = create_selection_panel_button(()=>{
		return all_tags.map(tag=>{
			const tag_element = document.createElement('p')
			tag_element.textContent = tag.name
			return tag_element
		})
	}, 'Add child tag')
	root.appendChild(add_child_tag_button)
	
	const tag_container = create_tag_container(tag_object.child_tags)
	root.appendChild(tag_container)

	return root
}




add_tag_button.addEventListener('click',()=>{
	const new_tag = new Tag();
	console.log(new_tag)
	tags_list.appendChild(create_editable_tag(new_tag, all_tags))
})



