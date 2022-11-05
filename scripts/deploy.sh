#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails

# run the build
npm run build
#deploy with semantic-release
npm run semantic-release -- --dry-run --repositoryUrl "$(git remote get-url origin | tr -d '\n')"

# deploy to gh pages
	mkdir -p pages
	cd pages

	git init

	git config user.name "carbon-bot"
	git config user.email "carbon@us.ibm.com"

	echo "Git has been configured to use carbon-bot"

	git pull "https://git:${GH_TOKEN}@github.com/akshat55/carbon-components-angular.git" gh-pages

	echo "carbon-components-angular gh-pages pull successful"

	# clean up old build files in the root
	rm -f *.js
	rm -f *.map
	rm -rf documentation

	mkdir -p documentation
	cp -R ../dist/docs/documentation/* ./documentation
	cp -R ../dist/docs/storybook/* ./

	version=$(node -e 'const package = require("./../dist/package.json"); console.log(package.version);')
	mkdir -p $version
	mkdir -p $version/documentation
	cp -R ../dist/docs/documentation/* $version/documentation
	cp -R ../dist/docs/storybook/* $version
	echo "Version of new package is: $version"

	echo "angular.carbondesignsystem.com" > CNAME

	# in this case we want the script to keep running, so we can actually check the $? (status) var
	set +e
	# Commit all the things into the repo
	git add .
	git commit -m "Deploy to GitHub Pages"

	echo "Deploy to github pages is good to go"

	# Force push to gh-pages if there was something to commit
	if [ $? -eq 0 ]; then
	echo "In here"
		# git push --force "https://git:${GH_TOKEN}@github.com/akshat55/carbon-components-angular.git" master:gh-pages > /dev/null 2>&1
	fi

	echo "Exit"

# just to be sure we exit cleanly
exit 0;
