Lamprey
=======

Lamprey is a simple system for creating and maintaining regular expressions connected to live websites. Yes, it's a nasty, heartless leech.

To use the system, just drag this link to your bookmarks bar:
[Lamprey](javascript:%28function%20%28%29%20%7B%20var%20lampreyURL%20%3D%20%22http%3A//woj/lamprey%22%3B%20window.Lamprey%20%3D%20window.Lamprey%20%7C%7C%20%7B%7D%3B%20window.Lamprey.bootstrapper%20%3D%20window.Lamprey.bootstrapper%20%7C%7C%20%7B%7D%3B%20window.Lamprey.bootstrapper.loadScripts%20%3D%20function%20%28scriptArray%2C%20onComplete%29%20%7B%20var%20numberOfLoadedScripts%20%3D%200%3B%20for%20%28var%20i%20%3D%200%3B%20i%20%3C%20scriptArray.length%3B%20i++%29%20%7B%20var%20s%20%3D%20%28document.getElementsByTagName%28%27head%27%29%5B0%5D%20%7C%7C%20document.body%29.appendChild%28document.createElement%28%27script%27%29%29%3B%20s.src%20%3D%20scriptArray%5Bi%5D%3B%20s.type%20%3D%20%27text/javascript%27%3B%20s.onload%20%3D%20function%20%28%29%20%7B%20numberOfLoadedScripts++%3B%20if%20%28numberOfLoadedScripts%20%3D%3D%20scriptArray.length%29%20%7B%20onComplete.call%28%29%3B%20%7D%20%7D%3B%20%7D%20%7D%3B%20window.Lamprey.bootstrapper.loadScripts%28%5BlampreyURL%20+%20%22/lamprey.js%22%5D%2C%20function%20%28%29%20%7B%7D%29%3B%20%7D%29%28%29%20)
