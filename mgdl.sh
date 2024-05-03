#!/bin/bash

mg=$1
ch=$2
sep="chap_"
chap="$sep$ch"
cbz="$1"_"$2".cbz

mkdir -p $mg

cd $mg

mkdir -p $chap

/usr/bin/node /home/rr/Scraping/prog.js $1 $2

zip $cbz $chap/*.webp

rm -rf $chap
