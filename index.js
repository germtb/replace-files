import path from 'path';
import fs from 'fs';

const root = '/Users/gmoreno/dev/replace-files';

const fileWalker = ({
	root,
	ignores = [
		'.git',
		'node_modules',
	],
	onFile,
	onDirectory,
	recursive,
}) => {
	const files = fs.readdirSync(root);
	files
	.filter(f => !ignores.includes(f))
	.map(f => path.join(root, f))
	.forEach(f => {
		const stat = fs.statSync(f);
		if (stat.isFile()) {
			onFile && onFile(f);
		} else if (recursive && stat.isDirectory()) {
			onDirectory && onDirectory(f);
			fileWalker({ root: f, ignores, onFile, onDirectory, recursive });
		}
	});
};

const replacePattern = /Example(\..*)/;
const replacement = 'ExampleSummary$1';

const replaceFiles = ({ root, recursive, replacePattern, replacement }) => {
	fileWalker({
		root,
		onFile: f => {
			const newPath = f.replace(replacePattern, replacement);
			if (f !== newPath) {
				fs.renameSync(f, newPath);
			}
		},
		recursive,
	});
};

replaceFiles({ root, recursive: false, replacePattern, replacement });
