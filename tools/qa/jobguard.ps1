# Dot-source at the top of every script that starts headless Chrome or Codex:   . "$PSScriptRoot\jobguard.ps1"
# Puts this PowerShell process (and so every process it starts later) into a Windows job object that
#   - runs at IDLE priority: the tools only use CPU that nothing else wants (VS Code / the user's apps stay responsive);
#   - is killed as a whole when this PowerShell process ends for ANY reason (finished, crashed, VS Code restarted,
#     Claude Code stopped), so no headless Chrome is ever left spinning without its launcher.
# Failing to set it up is not fatal: the script then just runs as before.
try {
  if (-not ('LabJob' -as [type])) {
    Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices;
public static class LabJob {
  [DllImport("kernel32.dll", CharSet = CharSet.Unicode)] static extern IntPtr CreateJobObject(IntPtr attr, string name);
  [DllImport("kernel32.dll")] static extern bool SetInformationJobObject(IntPtr job, int cls, IntPtr info, uint len);
  [DllImport("kernel32.dll")] static extern bool AssignProcessToJobObject(IntPtr job, IntPtr proc);
  [DllImport("kernel32.dll")] static extern IntPtr GetCurrentProcess();
  [StructLayout(LayoutKind.Sequential)] struct BASIC { public long UserTime; public long JobUserTime; public uint LimitFlags;
    public UIntPtr MinWs; public UIntPtr MaxWs; public uint ActiveProcs; public UIntPtr Affinity; public uint PriorityClass; public uint SchedulingClass; }
  [StructLayout(LayoutKind.Sequential)] struct IOC { public ulong a, b, c, d, e, f; }
  [StructLayout(LayoutKind.Sequential)] struct EXT { public BASIC Basic; public IOC Io; public UIntPtr ProcMem, JobMem, PeakProcMem, PeakJobMem; }
  public static IntPtr Handle;   // kept open for the life of this process; the OS closes it when the process ends -> job killed
  public static string Guard() {
    Handle = CreateJobObject(IntPtr.Zero, null); if (Handle == IntPtr.Zero) return "CreateJobObject failed";
    var e = new EXT(); e.Basic.LimitFlags = 0x2000 | 0x20; e.Basic.PriorityClass = 0x40;   // KILL_ON_JOB_CLOSE | PRIORITY_CLASS = IDLE
    int len = Marshal.SizeOf(typeof(EXT)); IntPtr p = Marshal.AllocHGlobal(len); Marshal.StructureToPtr(e, p, false);
    if (!SetInformationJobObject(Handle, 9, p, (uint)len)) return "SetInformationJobObject failed " + Marshal.GetLastWin32Error();
    if (!AssignProcessToJobObject(Handle, GetCurrentProcess())) return "AssignProcessToJobObject failed " + Marshal.GetLastWin32Error();
    return "ok";
  }
}
"@
  }
  if (-not [LabJob]::Handle -or [LabJob]::Handle -eq [IntPtr]::Zero) { $script:LabJobState = [LabJob]::Guard() }
} catch { $script:LabJobState = "jobguard unavailable: $($_.Exception.Message)" }
try { (Get-Process -Id $PID).PriorityClass = 'Idle' } catch {}
