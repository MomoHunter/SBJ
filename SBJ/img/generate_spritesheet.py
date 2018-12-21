import os
import json
import textwrap

from PIL import Image


names_per_category = {}
max_width_per_category = {}
max_height = 0
sprite_sheet_img = None
sprite_dict_data = {}


start_marker_text = '// start spriteDict'
end_marker_text = '// end spriteDict'
comment_text = """\
// The following code is auto-generated, don't change it!
/**
 * Maps a Sprite-Key to Location Information regarding the Sprite-Sheet
 * @type {Object.<string, Array<number>>} with the array's contents being: x-pos, y-pos, width, height
 */"""
text_indent = '  '


# region Search for all Images to pack:
for path, _, filenames in os.walk('sprites'):
    if len(filenames) < 1:
        continue  # directory with only folders, we need to go deeper

    _, category, *rest = path.split('\\')  # path is i.e. sprites\\Item\\Star\\0.png
    sub_path = '/'.join(rest)
    if sub_path:
        sub_path += '/'

    filenames = [name for name in filenames if name.endswith('.png')]
    names = [sub_path + name[:-len('.png')] for name in filenames]

    if category in names_per_category:
        names_per_category.update({
            category: names_per_category.get(category) + names
        })
    else:
        names_per_category.update({
            category: names
        })
# endregion

# region Determine dimensions:
for category in names_per_category:
    max_width = 0
    total_height = 0

    for name in names_per_category.get(category):
        with Image.open('sprites/' + category + '/' + name + '.png') as im:
            width, height = im.getdata().size
            if width > max_width:
                max_width = width
            total_height += height + 1

    max_width_per_category.update({category: max_width})
    if total_height > max_height:
        max_height = total_height
# endregion

# region Built Sprite-Sheet
sprite_sheet_img = Image.new(
    "RGBA",
    (sum([width + 1 for width in max_width_per_category.values()]), max_height)
)

x = 0
for category in names_per_category:
    y = 0
    for name in names_per_category.get(category):
        with Image.open('sprites/' + category + '/' + name + '.png') as im:
            image = im.getdata()
            width, height = image.size
            sprite_sheet_img.paste(image, (x, y, x + width, y + height))

        sprite_dict_data.update({category + '_' + name.replace('/', '_'): [x, y, width, height]})

        y += height + 1
    x += max_width_per_category.get(category) + 1
# endregion

# region Save
# ...the Spritesheet:
sprite_sheet_img.save('Spritesheet.png', 'PNG')

# ... the Sprite-Dict:
sprite_dict_text = json.dumps(sprite_dict_data)\
    .replace('{', '{\n' + text_indent).replace('], ', '],\n' + text_indent).replace(']}', ']\n}')
#   => one item per line plus indent for the inner lines
#   (when using the indent option of dumps, it splits tha data into separate lines)
sprite_dict_text = 'this.spriteDict = ' + sprite_dict_text + ';'

file_text_dict = textwrap.indent(
    '\n'.join([start_marker_text, comment_text, sprite_dict_text, end_marker_text]),
    text_indent
)

with open('../scripts/SBJ_main.js') as f:  # read surrounding text
    file_text = f.read()
    file_text_pre, file_text = file_text.split(text_indent + start_marker_text)
    _, file_text_post = file_text.split(end_marker_text)

with open('../scripts/SBJ_main.js', 'w') as f:  # clear file and write new text
    f.writelines([file_text_pre, file_text_dict, file_text_post])
# endregion
