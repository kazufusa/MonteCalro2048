#!/bin/sh
: > tmp/count.txt
size=100
tmp=0
for i in `seq 1 $size`; do
  tmp=$(($tmp+1))
  if [ $tmp -gt 4 ]; then
    wait
    tmp=0
  fi
  (node ./bin/successrate.js; echo $? >> tmp/count.txt) &
done
wait
echo `cat tmp/count.txt | grep -o 0 | wc -l` '/' $size
rm -rf tmp/count.txt
