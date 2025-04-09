



class Tag {
    constructor(tag_name, descending_tags, child_tags) {
        this.name = tag_name
        this.descending_tags = descending_tags
        this.child_tags = child_tags
    }
}




const winter_tag = new Tag('winter')
const clothes_tag = new Tag('clothes');
const winter_clothes_tag = new Tag('winter-clothes',[],[winter_tag, clothes_tag])
const cool_data_structure = [{tags:[winter_clothes_tag], value:'insert epic winter clothes'}]




function create_tag(name, tags=[]) {
    name = String(name)
    if (!Array.isArray(tags)) {
        throw new Error("tags is not array");
    }

    const root = document.createElement('div')
    root.className = 'tag'

    const tag_name = document.createElement('div')
    tag_name.className = 'tag-name'
    tag_name.textContent = name
    root.appendChild(tag_name)
    
    const tag_container = create_tag_container()
    for (const tag of tags) {
        tag_container.appendChild(tag)
    }
    root.appendChild(tag_container)

    return {root, tag_name, tag_container}
}




function create_tag_container() {
    const tag_container = document.createElement('div')
    tag_container.className = 'tag-container'
    return tag_container
}




function create_item_container(name) {
    const root = document.createElement('div')
    root.className = 'item-container'

    const item_name = document.createElement('div')
    item_name.className = 'item-name'
    item_name.textContent = name
    root.appendChild(item_name)

    const tag_container = create_tag_container(root)
    root.appendChild(tag_container)

    return {root, item_name, tag_container}
}




const item = create_item_container('foo faa foo faa')
item.tag_container.appendChild(create_tag('tag',[create_tag('tag tag').root]).root)
document.body.appendChild(item.root)

