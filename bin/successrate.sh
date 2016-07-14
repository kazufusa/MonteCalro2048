#!/bin/sh
: > tmp/count.txt
size=4
tmp=0
for i in `seq 1 $size`; do
  tmp=$(($tmp+1))
  if [ $tmp -gt 4 ]; then
    wait
    tmp=0
  fi
  (node ./bin/successrate.js && echo 's' >> tmp/count.txt) &
done
wait
echo `cat tmp/count.txt | wc -l` '/' $size
rm -rf tmp/count.txt
