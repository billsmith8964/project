#!/usr/bin/env python3
"""Basic smoke tests for the TalentBridge static site."""

from __future__ import annotations

import http.client
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOST = "127.0.0.1"
PORT = 8765


def wait_for_server(timeout_seconds: float = 5.0) -> None:
    deadline = time.time() + timeout_seconds
    last_error: Exception | None = None
    while time.time() < deadline:
        try:
            conn = http.client.HTTPConnection(HOST, PORT, timeout=1)
            conn.request("GET", "/")
            response = conn.getresponse()
            response.read()
            if response.status == 200:
                return
        except Exception as error:  # noqa: BLE001 - test helper
            last_error = error
        time.sleep(0.1)
    raise RuntimeError(f"server not ready: {last_error}")


def request(path: str) -> tuple[int, str]:
    conn = http.client.HTTPConnection(HOST, PORT, timeout=3)
    conn.request("GET", path)
    response = conn.getresponse()
    body = response.read().decode("utf-8", errors="replace")
    return response.status, body


def run() -> None:
    server = subprocess.Popen(
        ["python3", "-m", "http.server", str(PORT)],
        cwd=ROOT,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    try:
        wait_for_server()

        status, index = request("/")
        assert status == 200, f"expected 200 for /, got {status}"
        assert "TalentBridge" in index, "index page should include site title"
        assert "企业发布任务" in index, "index page should include employer section"
        assert "个人上传简历" in index, "index page should include candidate section"

        status, css = request("/styles.css")
        assert status == 200, f"expected 200 for /styles.css, got {status}"
        assert ".card" in css, "styles.css should contain card styles"

        status, script = request("/script.js")
        assert status == 200, f"expected 200 for /script.js, got {status}"
        assert "localStorage" in script, "script.js should include persistence logic"

        print("smoke tests passed")
    finally:
        server.terminate()
        try:
            server.wait(timeout=3)
        except subprocess.TimeoutExpired:
            server.kill()


if __name__ == "__main__":
    run()
