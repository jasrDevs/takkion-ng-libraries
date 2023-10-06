'use strict';
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.addBodyClass = exports.getHtmlHeadTagElement = exports.appendHtmlElementToHead = void 0;
const schematics_1 = require('@angular-devkit/schematics');
const parse5_element_1 = require('./parse5-element');
const parse5_1 = require('parse5');
/** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
function appendHtmlElementToHead(host, htmlFilePath, elementHtml) {
  const htmlFileBuffer = host.read(htmlFilePath);
  if (!htmlFileBuffer) {
    throw new schematics_1.SchematicsException(`Could not read file for path: ${htmlFilePath}`);
  }
  const htmlContent = htmlFileBuffer.toString();
  if (htmlContent.includes(elementHtml)) {
    return;
  }
  const headTag = getHtmlHeadTagElement(htmlContent);
  if (!headTag) {
    throw Error(`Could not find '<head>' element in HTML file: ${htmlFileBuffer}`);
  }
  // We always have access to the source code location here because the `getHeadTagElement`
  // function explicitly has the `sourceCodeLocationInfo` option enabled.
  const endTagOffset = headTag.sourceCodeLocation.endTag.startOffset;
  const indentationOffset = (0, parse5_element_1.getChildElementIndentation)(headTag);
  const insertion = `${' '.repeat(indentationOffset)}${elementHtml}`;
  const recordedChange = host.beginUpdate(htmlFilePath).insertRight(endTagOffset, `${insertion}\n`);
  host.commitUpdate(recordedChange);
}
exports.appendHtmlElementToHead = appendHtmlElementToHead;
/** Parses the given HTML file and returns the head element if available. */
function getHtmlHeadTagElement(htmlContent) {
  return getElementByTagName('head', htmlContent);
}
exports.getHtmlHeadTagElement = getHtmlHeadTagElement;
/** Adds a class to the body of the document. */
function addBodyClass(host, htmlFilePath, className) {
  const htmlFileBuffer = host.read(htmlFilePath);
  if (!htmlFileBuffer) {
    throw new schematics_1.SchematicsException(`Could not read file for path: ${htmlFilePath}`);
  }
  const htmlContent = htmlFileBuffer.toString();
  const body = getElementByTagName('body', htmlContent);
  if (!body) {
    throw Error(`Could not find <body> element in HTML file: ${htmlFileBuffer}`);
  }
  const classAttribute = body.attrs.find(attribute => attribute.name === 'class');
  if (classAttribute) {
    const hasClass = classAttribute.value
      .split(' ')
      .map(part => part.trim())
      .includes(className);
    if (!hasClass) {
      // We have source code location info enabled, and we pre-checked that the element
      // has attributes, specifically the `class` attribute.
      const classAttributeLocation = body.sourceCodeLocation.attrs.class;
      const recordedChange = host
        .beginUpdate(htmlFilePath)
        .insertRight(classAttributeLocation.endOffset - 1, ` ${className}`);
      host.commitUpdate(recordedChange);
    }
  } else {
    const recordedChange = host
      .beginUpdate(htmlFilePath)
      .insertRight(body.sourceCodeLocation.startTag.endOffset - 1, ` class="${className}"`);
    host.commitUpdate(recordedChange);
  }
}
exports.addBodyClass = addBodyClass;
/** Finds an element by its tag name. */
function getElementByTagName(tagName, htmlContent) {
  const document = (0, parse5_1.parse)(htmlContent, { sourceCodeLocationInfo: true });
  const nodeQueue = [...document.childNodes];
  while (nodeQueue.length) {
    const node = nodeQueue.shift();
    if (node.nodeName.toLowerCase() === tagName) {
      return node;
    } else if (node.childNodes) {
      nodeQueue.push(...node.childNodes);
    }
  }
  return null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1tYW5pcHVsYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3NjaGVtYXRpY3MvdXRpbHMvaHRtbC1tYW5pcHVsYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsMkRBQXFFO0FBQ3JFLHFEQUE0RDtBQUM1RCxtQ0FBbUQ7QUFFbkQsa0dBQWtHO0FBQ2xHLFNBQWdCLHVCQUF1QixDQUFDLElBQVUsRUFBRSxZQUFvQixFQUFFLFdBQW1CO0lBQzNGLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFL0MsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUNuQixNQUFNLElBQUksZ0NBQW1CLENBQUMsaUNBQWlDLFlBQVksRUFBRSxDQUFDLENBQUM7S0FDaEY7SUFFRCxNQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7SUFFOUMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ3JDLE9BQU87S0FDUjtJQUVELE1BQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRW5ELElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixNQUFNLEtBQUssQ0FBQyxpREFBaUQsY0FBYyxFQUFFLENBQUMsQ0FBQztLQUNoRjtJQUVELHlGQUF5RjtJQUN6Rix1RUFBdUU7SUFDdkUsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGtCQUFtQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDcEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLDJDQUEwQixFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELE1BQU0sU0FBUyxHQUFHLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFdBQVcsRUFBRSxDQUFDO0lBRW5FLE1BQU0sY0FBYyxHQUFH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LENBQUMsVUFBVSxFQUFFO1lBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDcEM7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1NjaGVtYXRpY3NFeGNlcHRpb24sIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7Z2V0Q2hpbGRFbGVtZW50SW5kZW50YXRpb259IGZyb20gJy4vcGFyc2U1LWVsZW1lbnQnO1xuaW1wb3J0IHtFbGVtZW50LCBwYXJzZSBhcyBwYXJzZUh0bWx9IGZyb20gJ3BhcnNlNSc7XG5cbi8qKiBBcHBlbmRzIHRoZSBnaXZlbiBlbGVtZW50IEhUTUwgZnJhZ21lbnQgdG8gdGhlIGA8aGVhZD5gIGVsZW1lbnQgb2YgdGhlIHNwZWNpZmllZCBIVE1MIGZpbGUuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kSHRtbEVsZW1lbnRUb0hlYWQoaG9zdDogVHJlZSwgaHRtbEZpbGVQYXRoOiBzdHJpbmcsIGVsZW1lbnRIdG1sOiBzdHJpbmcpIHtcbiAgY29uc3QgaHRtbEZpbGVCdWZmZXIgPSBob3N0LnJlYWQoaHRtbEZpbGVQYXRoKTtcblxuICBpZiAoIWh0bWxGaWxlQnVmZmVyKSB7XG4gICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENvdWxkIG5vdCByZWFkIGZpbGUgZm9yIHBhdGg6ICR7aHRtbEZpbGVQYXRofWApO1xuICB9XG5cbiAgY29uc3QgaHRtbENvbnRlbnQgPSBodG1sRmlsZUJ1ZmZlci50b1N0cmluZygpO1xuXG4gIGlmIChodG1sQ29udGVudC5pbmNsdWRlcyhlbGVtZW50SHRtbCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBoZWFkVGFnID0gZ2V0SHRtbEhlYWRUYWdFbGVtZW50KGh0bWxDb250ZW50KTtcblxuICBpZiAoIWhlYWRUYWcpIHtcbiAgICB0aHJvdyBFcnJvcihgQ291bGQgbm90IGZpbmQgJzxoZWFkPicgZWxlbWVudCBpbiBIVE1MIGZpbGU6ICR7aHRtbEZpbGVCdWZmZXJ9YCk7XG4gIH1cblxuICAvLyBXZSBhbHdheXMgaGF2ZSBhY2Nlc3MgdG8gdGhlIHNvdXJjZSBjb2RlIGxvY2F0aW9uIGhlcmUgYmVjYXVzZSB0aGUgYGdldEhlYWRUYWdFbGVtZW50YFxuICAvLyBmdW5jdGlvbiBleHBsaWNpdGx5IGhhcyB0aGUgYHNvdXJjZUNvZGVMb2NhdGlvbkluZm9gIG9wdGlvbiBlbmFibGVkLlxuICBjb25zdCBlbmRUYWdPZmZzZXQgPSBoZWFkVGFnLnNvdXJjZUNvZGVMb2NhdGlvbiEuZW5kVGFnLnN0YXJ0T2Zmc2V0O1xuICBjb25zdCBpbmRlbnRhdGlvbk9mZnNldCA9IGdldENoaWxkRWxlbWVudEluZGVudGF0aW9uKGhlYWRUYWcpO1xuICBjb25zdCBpbnNlcnRpb24gPSBgJHsnICcucmVwZWF0KGluZGVudGF0aW9uT2Zmc2V0KX0ke2VsZW1lbnRIdG1sfWA7XG5cbiAgY29uc3QgcmVjb3JkZWRDaGFuZ2UgPSBob3N0LmJlZ2luVXBkYXRlKGh0bWxGaWxlUGF0aCkuaW5zZXJ0UmlnaHQoZW5kVGFnT2Zmc2V0LCBgJHtpbnNlcnRpb259XFxuYCk7XG5cbiAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZWRDaGFuZ2UpO1xufVxuXG4vKiogUGFyc2VzIHRoZSBnaXZlbiBIVE1MIGZpbGUgYW5kIHJldHVybnMgdGhlIGhlYWQgZWxlbWVudCBpZiBhdmFpbGFibGUuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHRtbEhlYWRUYWdFbGVtZW50KGh0bWxDb250ZW50OiBzdHJpbmcpOiBFbGVtZW50IHwgbnVsbCB7XG4gIHJldHVybiBnZXRFbGVtZW50QnlUYWdOYW1lKCdoZWFkJywgaHRtbENvbnRlbnQpO1xufVxuXG4vKiogQWRkcyBhIGNsYXNzIHRvIHRoZSBib2R5IG9mIHRoZSBkb2N1bWVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRCb2R5Q2xhc3MoaG9zdDogVHJlZSwgaHRtbEZpbGVQYXRoOiBzdHJpbmcsIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnN0IGh0bWxGaWxlQnVmZmVyID0gaG9zdC5yZWFkKGh0bWxGaWxlUGF0aCk7XG5cbiAgaWYgKCFodG1sRmlsZUJ1ZmZlcikge1xuICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKGBDb3VsZCBub3QgcmVhZCBmaWxlIGZvciBwYXRoOiAke2h0bWxGaWxlUGF0aH1gKTtcbiAgfVxuXG4gIGNvbnN0IGh0bWxDb250ZW50ID0gaHRtbEZpbGVCdWZmZXIudG9TdHJpbmcoKTtcbiAgY29uc3QgYm9keSA9IGdldEVsZW1lbnRCeVRhZ05hbWUoJ2JvZHknLCBodG1sQ29udGVudCk7XG5cbiAgaWYgKCFib2R5KSB7XG4gICAgdGhyb3cgRXJyb3IoYENvdWxkIG5vdCBmaW5kIDxib2R5PiBlbGVtZW50IGluIEhUTUwgZmlsZTogJHtodG1sRmlsZUJ1ZmZlcn1gKTtcbiAgfVxuXG4gIGNvbnN0IGNsYXNzQXR0cmlidXRlID0gYm9keS5hdHRycy5maW5kKGF0dHJpYnV0ZSA9PiBhdHRyaWJ1dGUubmFtZSA9PT0gJ2NsYXNzJyk7XG5cbiAgaWYgKGNsYXNzQXR0cmlidXRlKSB7XG4gICAgY29uc3QgaGFzQ2xhc3MgPSBjbGFzc0F0dHJpYnV0ZS52YWx1ZVxuICAgICAgLnNwbGl0KCcgJylcbiAgICAgIC5tYXAocGFydCA9PiBwYXJ0LnRyaW0oKSlcbiAgICAgIC5pbmNsdWRlcyhjbGFzc05hbWUpO1xuXG4gICAgaWYgKCFoYXNDbGFzcykge1xuICAgICAgLy8gV2UgaGF2ZSBzb3VyY2UgY29kZSBsb2NhdGlvbiBpbmZvIGVuYWJsZWQsIGFuZCB3ZSBwcmUtY2hlY2tlZCB0aGF0IHRoZSBlbGVtZW50XG4gICAgICAvLyBoYXMgYXR0cmlidXRlcywgc3BlY2lmaWNhbGx5IHRoZSBgY2xhc3NgIGF0dHJpYnV0ZS5cbiAgICAgIGNvbnN0IGNsYXNzQXR0cmlidXRlTG9jYXRpb24gPSBib2R5LnNvdXJjZUNvZGVMb2NhdGlvbiEuYXR0cnMhLmNsYXNzO1xuICAgICAgY29uc3QgcmVjb3JkZWRDaGFuZ2UgPSBob3N0XG4gICAgICAgIC5iZWdpblVwZGF0ZShodG1sRmlsZVBhdGgpXG4gICAgICAgIC5pbnNlcnRSaWdodChjbGFzc0F0dHJpYnV0ZUxvY2F0aW9uLmVuZE9mZnNldCAtIDEsIGAgJHtjbGFzc05hbWV9YCk7XG4gICAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlZENoYW5nZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHJlY29yZGVkQ2hhbmdlID0gaG9zdFxuICAgICAgLmJlZ2luVXBkYXRlKGh0bWxGaWxlUGF0aClcbiAgICAgIC5pbnNlcnRSaWdodChib2R5LnNvdXJjZUNvZGVMb2NhdGlvbiEuc3RhcnRUYWcuZW5kT2Zmc2V0IC0gMSwgYCBjbGFzcz1cIiR7Y2xhc3NOYW1lfVwiYCk7XG4gICAgaG9zdC5jb21taXRVcGRhdGUocmVjb3JkZWRDaGFuZ2UpO1xuICB9XG59XG5cbi8qKiBGaW5kcyBhbiBlbGVtZW50IGJ5IGl0cyB0YWcgbmFtZS4gKi9cbmZ1bmN0aW9uIGdldEVsZW1lbnRCeVRhZ05hbWUodGFnTmFtZTogc3RyaW5nLCBodG1sQ29udGVudDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBkb2N1bWVudCA9IHBhcnNlSHRtbChodG1sQ29udGVudCwge3NvdXJjZUNvZGVMb2NhdGlvbkluZm86IHRydWV9KTtcbiAgY29uc3Qgbm9kZVF1ZXVlID0gWy4uLmRvY3VtZW50LmNoaWxkTm9kZXNdO1xuXG4gIHdoaWxlIChub2RlUXVldWUubGVuZ3RoKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5vZGVRdWV1ZS5zaGlmdCgpIGFzIEVsZW1lbnQ7XG5cbiAgICBpZiAobm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0YWdOYW1lKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9IGVsc2UgaWYgKG5vZGUuY2hpbGROb2Rlcykge1xuICAgICAgbm9kZVF1ZXVlLnB1c2goLi4ubm9kZS5jaGlsZE5vZGVzKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cbiJdfQ==
