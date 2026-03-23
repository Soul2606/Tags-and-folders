


const tagsList = document.getElementById('tags-list')!
const addTagButton = document.getElementById('add-tag-button')!




const allTags:Tag[] = []
class Tag {
	name:string
	descendingTags:Tag[]
	childTags:Tag[]

	constructor(name = 'new tag', descendingTags:Tag[] = [], childTags:Tag[] = []) {
		this.name = name
		this.descendingTags = descendingTags
		this.childTags = childTags
		allTags.push(this)
	}

	getInheritedTags(checked = new Set<Tag>()){
		const inherited = new Set<Tag>()
		for (const tag of this.childTags) {
			if (checked.has(tag)) continue
			checked.add(tag)
			inherited.add(tag)
			tag.getInheritedTags(checked).forEach(tag=>inherited.add(tag))
		}
		return inherited
	}

	remove(){
		const index = allTags.indexOf(this)
		if (index === -1) {
			console.warn(`Cannot remove ${this.name}`)
			return
		}
		allTags.splice(index,1)
	}
}




const itemTag = new Tag('item');
const winterTag = new Tag('winter')
const clothesTag = new Tag('clothes',[],[itemTag]);
const winterClothesTag = new Tag('winter-clothes',[],[winterTag, clothesTag])




function createTagElement(name='-', childTagElements:HTMLElement[] = []) {

	const root = document.createElement('div')
	root.className = 'tag'

	const tagName = document.createElement('div')
	tagName.className = 'tag-name'
	tagName.textContent = name
	root.appendChild(tagName)
	
	const tagContainer = createTagContainer(childTagElements)
	root.appendChild(tagContainer)

	return root
}




function createInheritedTag(name='-') {
	const root = document.createElement('div')
	root.className = 'inherited-tag tag'
	root.textContent = name
	return root
}




function createMinorTag(name='-') {
	const root = document.createElement('div')
	root.className = 'minor-tag'
	root.textContent = name
	return root
}




function createTagContainer(tags:HTMLElement[] = []) {
	if (!Array.isArray(tags)) {
		console.log('tags',tags)
		throw new Error("tags is not array", tags);
	}
	const tagContainer = document.createElement('div')
	tagContainer.className = 'tag-container'
	for (const tag of tags) {
		tagContainer.appendChild(tag)
	}
	return tagContainer
}




function createItemContainer(name:string, tags=[]) {
	const root = document.createElement('div')
	root.className = 'item-container'

	const itemName = document.createElement('div')
	itemName.className = 'item-name'
	itemName.textContent = name
	root.appendChild(itemName)

	const tagContainer = createTagContainer(tags)
	root.appendChild(tagContainer)

	return root
}




function createSelectionPanelButton(getPanelElements:(v:HTMLElement)=>HTMLElement[], textContent:string) {
	//Pure function
	const root = document.createElement('button')
	root.className = 'selection-button'
	root.textContent = textContent
	root.addEventListener('click',()=>{
		const selection = document.createElement('div')
		selection.className = 'selection-panel'
		const rect = root.getBoundingClientRect()
		selection.style.top = `${rect.top}px`
		selection.style.left = `${rect.left}px`
		const elements = getPanelElements(selection)
		if (elements.length === 0) {
			selection.innerHTML += '<p>Nothing here</p>'
		}
		for (const element of elements) {
			selection.appendChild(element)
		}
		document.body.appendChild(selection)

		selection.addEventListener('mouseleave',()=>{
			selection.remove()
		})
	})
	return root
}




function createEditableTag(tag:Tag, allTags:readonly Tag[], tagChangedCallback:(tag:Tag, el:HTMLElement)=>void) {

	const root = document.createElement('div')
	root.className = 'editable-tag'

	const tagName = document.createElement('input')
	tagName.type = 'text'
	tagName.className = 'editable-tag-name'
	tagName.value = String(tag.name)
	tagName.addEventListener('input',()=>{
		tag.name = tagName.value
		console.log(tag)
		tagChangedCallback(tag, root)
	})
	root.appendChild(tagName)
	
	const addChildTagButton = createSelectionPanelButton(selection_panel=>{
		return allTags.filter(t =>
			t !== tag && (!tag.childTags.includes(t))
		).map(tag=>{
			const tagBtn = document.createElement('button')
			tagBtn.textContent = tag.name
			tagBtn.addEventListener('click',()=>{
				tag.childTags.push(tag)
				console.log(tag, tag)
				selection_panel.remove()
				tagChangedCallback(tag, root)
			})
			return tagBtn
		})
	}, 'Add child tag')
	root.appendChild(addChildTagButton)

	let prevTagContainer:HTMLElement
	const update = ()=>{
		tagName.value = String(tag.name)

		const onlyInheritedTags = tag.getInheritedTags().difference(new Set(tag.childTags))
		const inheritedTagElements = Array.from(onlyInheritedTags).map(tag=>createInheritedTag(tag.name))
		const childTagElements = tag.childTags.map(tag=>createTagElement(tag.name, tag.childTags.map(tag=>createMinorTag(tag.name))))
		const tagContainer = createTagContainer(childTagElements.concat(inheritedTagElements))

		if (prevTagContainer) {
			root.replaceChild(tagContainer, prevTagContainer)
		}else{
			root.appendChild(tagContainer)
		}
		prevTagContainer = tagContainer

		return root
	}

	update()

	return {element:root, update}
}




let allUpdateFunctions:{element:HTMLElement, update:()=>void, tag:Tag}[] = []
const callAllUpdateFunctions = (tag:Tag) => {
	console.log(allUpdateFunctions, tag)
	allUpdateFunctions = allUpdateFunctions.filter(e=>document.body.contains(e.element))
	allUpdateFunctions.filter(e=>Array.from(e.tag.getInheritedTags()).includes(tag)).forEach(e=>e.update())
}
for (const tag of allTags) {
	if (!(tag instanceof Tag)) throw new Error("tag is not tag");
	const {element, update} = createEditableTag(tag, allTags, callAllUpdateFunctions)
	tagsList.appendChild(element)
	allUpdateFunctions.push({element, update, tag})
}




addTagButton.addEventListener('click',()=>{
	const newTag = new Tag();
	console.log(newTag)
	const {element, update} = createEditableTag(newTag, allTags, callAllUpdateFunctions)
	tagsList.appendChild(element)
	allUpdateFunctions.push({element, update, tag:newTag})
})



