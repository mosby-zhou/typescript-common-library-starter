import ejs from 'ejs';

export interface TemplateData {
  projectName: string;
  projectCodeName: string;
  groupName: string;
  userName: string;
  userEmail: string;
}

function render(content: string, data: TemplateData) {
  return ejs.render(content, data);
}

export default render;
