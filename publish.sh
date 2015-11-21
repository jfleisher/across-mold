# create a local gh-pages branch containing the splitted output folder
git subtree split --prefix dist -b gh-pages
# force the push of the gh-pages branch to the remote gh-pages branch at origin
git push -f origin gh-pages:gh-pages
# remove the subtree branch from the local machine
git branch -D gh-pages
