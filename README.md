Nodejs application based on https://github.com/karpathy/neuraltalk2 model.

![Alt text](sc1.jpg?raw=true "Home Page")
![Alt text](sc2.jpg?raw=true "Captioned text")

git clone https://github.com/torch/distro.git ~/torch --recursive
cd ~/torch; bash install-deps;
./install.sh
PATH=/home/ubuntu/torch/install/bin\:$PATH ; export PATH

luarocks install nn
luarocks install nngraph 
luarocks install image

sudo apt-get install libprotobuf-dev protobuf-compiler
luarocks install loadcaffe

sudo apt-get install libhdf5-dev
sudo apt-get install libhdf5-serial-dev hdf5-tools
git clone https://github.com/deepmind/torch-hdf5
cd torch-hdf5
luarocks make hdf5-0-0.rockspec

Copy ImageCaptioning directory to neuraltalk/vis folder
Run node app.js from vis folder
