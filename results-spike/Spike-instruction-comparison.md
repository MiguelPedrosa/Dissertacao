┌─────────┬───────────┬───────────┬───────────┬───────────────────┬──────────────────┬────────────────────────────────────┐
│ (index) │   Blank   │  Simple   │   Clava   │ Simple (stripped) │ Clava (stripped) │ Stripped Comparison (Clava/Simple) │
├─────────┼───────────┼───────────┼───────────┼───────────────────┼──────────────────┼────────────────────────────────────┤
│  SAXPY  │  2610012  │  5664880  │  5663321  │      3054868      │     3053309      │         0.9994896669839745         │
│  GEMM   │ 273706208 │ 347076938 │ 335958102 │     73370730      │     62251894     │         0.8484567892400688         │
│ MEMCPY  │  2610013  │  5523352  │  5522296  │      2913339      │     2912283      │         0.9996375293091535         │
│   3MM   │ 273706216 │ 345751534 │ 335152442 │     72045318      │     61446226     │         0.8528829867889541         │
└─────────┴───────────┴───────────┴───────────┴───────────────────┴──────────────────┴────────────────────────────────────┘