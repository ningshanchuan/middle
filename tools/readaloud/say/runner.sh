#!/bin/bash
# say batch runner: bash runner.sh <worker id>. Each batch: Codex writes the spoken scripts, Codex reviews them,
# validate.py checks both. Files: queue/bNNN.jsonl -> running -> done/bNNN.{jsonl,gen.jsonl,chk.jsonl,val.txt}
W=$1; D=/f/Shanchuan/Biology_study/.labtmp/tn; Q=$D/say
cd $D
log() { echo "$(date '+%H:%M:%S') w$W $*" | tee -a $Q/runner.log; }
while true; do
  b=$(ls $Q/queue/*.jsonl 2>/dev/null | head -1); [ -z "$b" ] && { log "queue empty"; break; }
  n=$(basename $b .jsonl); mv "$b" $Q/running/ 2>/dev/null || continue
  IN=say/running/$n.jsonl; GEN=say/running/$n.gen.jsonl; CHK=say/running/$n.chk.jsonl
  sed -e "s#__IN__#$IN#g" -e "s#__GEN__#$GEN#g" $Q/tpl_gen.md > $Q/running/$n.gen.md
  sed -e "s#__IN__#$IN#g" -e "s#__GEN__#$GEN#g" -e "s#__CHK__#$CHK#g" $Q/tpl_check.md > $Q/running/$n.chk.md
  log "start $n"
  powershell -ExecutionPolicy Bypass -File ../codex_task.ps1 -PromptFile "say/running/$n.gen.md" -Out "say/running/$n.gen.result.md" -Cd 'F:\Shanchuan\Biology_study\.labtmp\tn' -Effort high > /dev/null
  [ -s $GEN ] || { log "FAILED gen $n"; mv $Q/running/$n.* $Q/failed/; continue; }
  PYTHONIOENCODING=utf-8 /c/Users/Shanchuan/.local/bin/python3.15.exe -I validate.py $GEN $IN > $Q/running/$n.val_gen.txt
  powershell -ExecutionPolicy Bypass -File ../codex_task.ps1 -PromptFile "say/running/$n.chk.md" -Out "say/running/$n.chk.result.md" -Cd 'F:\Shanchuan\Biology_study\.labtmp\tn' -Effort high > /dev/null
  [ -s $CHK ] || { log "FAILED check $n"; mv $Q/running/$n.* $Q/failed/; continue; }
  PYTHONIOENCODING=utf-8 /c/Users/Shanchuan/.local/bin/python3.15.exe -I validate.py $CHK $IN > $Q/running/$n.val_chk.txt
  mv $Q/running/$n.* $Q/done/
  log "done $n: gen $(head -1 $Q/done/$n.val_gen.txt) | check $(head -1 $Q/done/$n.val_chk.txt) | changed $(grep -c '"changed": *true' $Q/done/$n.chk.jsonl)"
done
