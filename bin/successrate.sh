#!/bin/sh
: > tmp/count.txt
size=100
tmp=0
for i in `seq 1 $size`; do
  tmp=$(($tmp+1))
  if [ $tmp -gt 2 ]; then
    wait
    tmp=1
  fi
  (node ./bin/autoplay.js >/dev/null 2>&1; echo $? >> tmp/count.txt) &
done
wait
echo `cat tmp/count.txt | grep -o 0 | wc -l` '/' $size
rm -rf tmp/count.txt
