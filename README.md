# BGIDB

A Browser Server software for the management of both fundus image and retinal OCT image

front end: JS, HTML, CSS(Bootstrap)

back end: PHP (Thinkphp)

Contact: howard@tju.edu.cn

Author: Qi He

## Fundus image

Optic disc:

| B-Spline mode (Disc) | Ovel mode (Disc) | Adaptive oval mode (Disc) |
| :-------------: |:-------------:|:-------------:|
| ![](./recordGIF/b-spline.gif) |  ![](./recordGIF/oval.gif) | ![](./recordGIF/oval-and-modify.gif) |

Optic cup:

| B-Spline mode (Cup) | Ovel mode (Cup) | Adaptive oval mode (Cup) |
| :-------------: |:-------------:|:-------------:|
| ![](./recordGIF/b-spline-cup.gif) |  ![](./recordGIF/oval-cup.gif) | ![](./recordGIF/oval-and-modify-cup.gif) |

Export mask:

| B-Spline mode  (Disc/Cup) | 
| :-------------: |
| <img src="./recordGIF/mask.gif" width="300"> |

## OCT Image


| OCT files browser |Preview layers | Check layer list|
| :-------------: |:-------------:|:-------------:|
| ![](./recordGIF/file-browser.gif) |  ![](./recordGIF/preview.gif) | ![](./recordGIF/layer-list.gif) |

| Draw | Erase | Modify |
| :-------------: |:-------------:|:-------------:|
| ![](./recordGIF/pen.gif) |  ![](./recordGIF/erase.gif) | ![](./recordGIF/modify.gif) |

| Move | Zoom in/out | - |
| :-------------: |:-------------:|:-------------:|
| <img src="./recordGIF/move.gif" width="300">) |  <img src="./recordGIF/zoom-in-zoom-out.gif" width="300"> | - |


Import/Export image:

| import fundus image and OCT image | import the labeled mask of fundus image and OCT image |
| :-------------: | :-------------: |
| <img src="./recordGIF/import.gif" width="300"> | <img src="./recordGIF/export.gif" width="300"> |

## Reference
If you find our work useful in your research, please consider citing our paper:
```
@article{zou2018bgidb,
  title={BGIDB: A fundus ground truth building tool with automatic DDLS classification for glaucoma research},
  author={Zou, Bei-ji and Guo, Yun-di and Chen, Zai-liang and He, Qi and Zhu, Cheng-zhang and Ouyang, Ping-bo},
  journal={Journal of Central South University},
  volume={25},
  number={9},
  pages={2058--2068},
  year={2018},
  publisher={Springer}
}
}
```
